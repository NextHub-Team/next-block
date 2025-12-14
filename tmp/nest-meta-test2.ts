import 'reflect-metadata';
import { Controller } from '@nestjs/common';
import { PATH_METADATA } from '@nestjs/common/constants';

@Controller('parent')
class Parent {}

@Controller('child')
class Child extends Parent {}

console.log('Parent path', Reflect.getMetadata(PATH_METADATA, Parent));
console.log('Child path', Reflect.getMetadata(PATH_METADATA, Child));
