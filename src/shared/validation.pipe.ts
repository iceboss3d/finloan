import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { apiResponse } from 'src/helpers/apiResponse';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {
if(value instanceof Object && this.isEmpty(value)){
    throw new HttpException(`Validation Error: Empty Body Object`, HttpStatus.BAD_REQUEST)
}

      const {metatype} = metadata;
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new HttpException(`Validation Error: ${this.formatErrors(errors)}`, HttpStatus.BAD_REQUEST)
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private formatErrors(errors: any[]){
      return errors.map(err => {
          for (const property in err.constraints) {
              if (Object.prototype.hasOwnProperty.call(err.constraints, property)) {
                  const element = err.constraints[property];
                  return element;
              }
          }
      }).join(', ')
  }

  private isEmpty(value: any){
      if(Object.keys(value).length > 0) {
          return false;
      }
      return true;
  }
}