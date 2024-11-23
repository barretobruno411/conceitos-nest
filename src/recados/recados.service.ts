import { Injectable, NotFoundException } from '@nestjs/common';
import { Recado } from './entities/recado.entity';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RecadosService {
  constructor(
    @InjectRepository(Recado)
    private readonly recadoRepository: Repository<Recado>,
  ) {}

  private lastId = 1;
  private recados: Recado[] = [
    {
      id: 1,
      texto: 'Este é um recado de teste',
      de: 'Joana',
      para: 'João',
      lido: false,
      data: new Date(),
    },
  ];

  throwNotFoundError() {
    throw new NotFoundException('Recado nao encontrado');
  }

  async findAll() {
    const recados = await this.recadoRepository.find();
    return recados;
  }

  async findOne(id: number) {
    const recado = await this.recadoRepository.findOne({
      where: {
        id,
      },
    });

    if (recado) return recado;

    throw new NotFoundException();
  }

  async create(createRecadoDto: CreateRecadoDto) {
    const novoRecado = {
      ...createRecadoDto,
      lido: false,
      data: new Date(),
    };

    const recado = await this.recadoRepository.create(novoRecado);

    if (!recado) throw new NotFoundException();

    return this.recadoRepository.save(recado);
  }

  update(id: string, updateRecadoDto: UpdateRecadoDto) {
    const recadoExistenteIndex = this.recados.findIndex(
      (item) => item.id === +id,
    );
    if (recadoExistenteIndex < 0) {
      this.throwNotFoundError();
    }

    const recadoExixtente = this.recados[recadoExistenteIndex];
    this.recados[recadoExistenteIndex] = {
      ...recadoExixtente,
      ...updateRecadoDto,
    };
  }

  async remove(id: number) {
    const recado = await this.findOne(id);
    if (!recado) throw new NotFoundException();
    return await this.recadoRepository.remove(recado);
  }
}
