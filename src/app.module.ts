import { AppService } from './app.service';
import {CartModule} from "./cart/cart.module";
import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { AppController } from './app.controller';
import {RedisModule} from "./redis/redis.module";
import {JwtModule} from "@nestjs/jwt";
import {AppMiddleware} from "./app.middleware";

@Module({
  imports: [
      RedisModule,
      CartModule,
      JwtModule.register({
          secret: 'michalklatkoski123',
      }),
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements NestModule {

    configure(consumer: MiddlewareConsumer) : MiddlewareConsumer | void {
        consumer
            .apply(AppMiddleware)
            .forRoutes('/');
    }
}
