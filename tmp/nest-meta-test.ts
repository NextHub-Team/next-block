import 'reflect-metadata';
import { Controller } from '@nestjs/common';
import { PATH_METADATA } from '@nestjs/common/constants';

@Controller('base')
class Base {}

class Derived extends Base {}

console.log('Base', Reflect.getMetadata(PATH_METADATA, Base));
console.log('Derived', Reflect.getMetadata(PATH_METADATA, Derived));
