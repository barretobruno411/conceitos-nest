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

  async update(id: number, updateRecadoDto: UpdateRecadoDto) {
    const partialUpdateRecadoDto = {
      texto: updateRecadoDto?.texto,
      lido: updateRecadoDto?.lido,
    };

    const recado = await this.recadoRepository.preload({
      id,
      ...partialUpdateRecadoDto,
    });

    if (!recado) throw new NotFoundException();

    await this.recadoRepository.save(recado);

    return recado;
  }

  async remove(id: number) {
    const recado = await this.findOne(id);
    if (!recado) throw new NotFoundException();
    return await this.recadoRepository.remove(recado);
  }
}
