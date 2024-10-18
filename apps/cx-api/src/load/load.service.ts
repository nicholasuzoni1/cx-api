import { Injectable } from '@nestjs/common';
import { CreateLoadDto, LoadAdditionalData } from './dto/create-load.dto';
import { UpdateLoadDto } from './dto/update-load.dto';
import { UserEntity } from 'apps/cx-api/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LoadEntity } from 'apps/cx-api/entities/load.entity';
import {
  AlreadyExistsErrorHttp,
  NotFoundErrorHttp,
} from '@app/shared-lib/http-errors';
import { LangKeys } from '@app/lang-lib/lang-keys';
import { LoadConverter } from './converters/load';

@Injectable()
export class LoadService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntity: Repository<UserEntity>,
    @InjectRepository(LoadEntity)
    private readonly loadEntity: Repository<LoadEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async create(input: CreateLoadDto, additionalData: LoadAdditionalData) {
    try {
      const user = await this.userEntity.findOne({
        where: {
          id: additionalData.createdBy,
        },
      });

      if (!user) {
        throw new AlreadyExistsErrorHttp(LangKeys.AccountAlreadyExistsKey);
      }

      let newLoad = this.loadEntity.create();

      newLoad = LoadConverter.toCreateInput(newLoad, input, additionalData);

      const savedLoad = await this.loadEntity.save(newLoad);

      const output = LoadConverter.fromTable(savedLoad);
      return output;
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      const loads = await this.loadEntity.find();

      const output = loads.map((l) => {
        return LoadConverter.fromTable(l);
      });

      return output;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const load = await this.loadEntity.findOne({
        where: {
          id: id,
        },
      });

      if (!load) {
        throw new NotFoundErrorHttp(LangKeys.LoadNotFoundErrorKey);
      }

      const output = LoadConverter.fromTable(load);
      return output;
    } catch (error) {
      throw error;
    }
  }

  async update(input: UpdateLoadDto, associatedTo: number) {
    try {
      let load = await this.loadEntity.findOne({
        where: {
          id: input.id,
          associated_to: associatedTo,
        },
      });

      if (!load) {
        throw new NotFoundErrorHttp(LangKeys.LoadNotFoundErrorKey);
      }

      load = LoadConverter.toUpdateInput(load, input);

      const savedLoad = await this.loadEntity.save(load);

      const output = LoadConverter.fromTable(savedLoad);
      return output;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number, associatedTo: number) {
    try {
      const load = await this.loadEntity.findOne({
        where: {
          id: id,
          associated_to: associatedTo,
        },
      });

      if (!load) {
        throw new NotFoundErrorHttp(LangKeys.LoadNotFoundErrorKey);
      }

      this.loadEntity.softDelete(load);

      const output = {};
      return output;
    } catch (error) {
      throw error;
    }
  }
}
