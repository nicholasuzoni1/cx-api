import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { LoadLocation } from '../load/dto/create-load.dto';

@Injectable()
export class MapService {
  constructor() {}

  async getMilageDetails(
    origin: LoadLocation,
    destination: LoadLocation,
  ): Promise<number> {
    try {
      const originLat = origin?.lat;
      const originLong = origin?.lng;
      const destinationLat = destination?.lat;
      const destinationLang = destination?.lng;

      const originLocation = origin?.address;
      const destinationLocation = destination?.address;

      const response = await axios.get(
        'https://maps.googleapis.com/maps/api/distancematrix/json',
        {
          params: {
            origins: originLocation,
            destinations: destinationLocation,
            mode: 'driving',
            key: process.env.GOOGLE_MAP_KEY,
          },
        },
      );

      const data = response?.data;

      if (
        data &&
        data.status === 'OK' &&
        data.rows[0].elements[0].status === 'OK'
      ) {
        const distanceMeters = data.rows[0].elements[0].distance.value;
        const mileage = distanceMeters / 1609.34;

        return Number(mileage.toFixed(2));
      }

      return 0;
    } catch (error) {
      console.log(error);
      return 0;
    }
  }
}
