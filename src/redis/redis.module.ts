import {CacheModule, Module} from '@nestjs/common';
import {redisStore} from "cache-manager-redis-store";

@Module({
    imports: [
        CacheModule.register({
            isGlobal: true,
            // @ts-ignore
            store: async () => {
                return await redisStore({
                    socket: {
                        host: 'localhost',
                        port: 6379,
                    },
                    ttl: 3600
                });
            },
        }),
    ]
})
export class RedisModule {}