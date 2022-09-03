import { Injectable } from '@nestjs/common';
// import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { Model } from 'mongoose';
import { Pokemon } from '../pokemon/entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { AxiosAdapter } from '../common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  // private readonly axios: AxiosInstance = axios;

  constructor(
    @InjectModel(Pokemon.name) private readonly pokemonmodel: Model<Pokemon>,
    private readonly http: AxiosAdapter,
  ) {}

  async executeSeed() {
    await this.pokemonmodel.deleteMany({});

    const data = await this.http.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=650',
    );

    // const insertPromisesArray = [];
    // data.results.forEach(async ({ name, url }) => {
    //   const segments = url.split('/');
    //   const no: number = +segments.at(-2);
    //   insertPromisesArray.push(this.pokemonmodel.create({ name, no }));
    // });
    // await Promise.all(insertPromisesArray);

    // data.results.forEach(async ({ name, url }) => {
    //   const segments = url.split('/');
    //   const no: number = +segments.at(-2);
    //   await this.pokemonmodel.create({ name, no });
    // });

    const pokemonToInsert: { name: string; no: number }[] = data.results.map(
      ({ name, url }) => {
        const segments = url.split('/');
        const no: number = +segments.at(-2);
        return { name, no };
      },
    );
    await this.pokemonmodel.insertMany(pokemonToInsert);

    return 'Seed executed';
  }
}
