"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_module_1 = require("./app.module");
const helmet_1 = require("helmet");
const compression_1 = require("compression");
const cookie_parser_1 = require("cookie-parser");
const express_rate_limit_1 = require("express-rate-limit");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        bufferLogs: true,
    });
    const configService = app.get(config_1.ConfigService);
    const logger = new common_1.Logger('Bootstrap');
    const port = configService.get('PORT', 3001);
    const frontendUrl = configService.get('FRONTEND_URL', 'http://localhost:3000');
    app.use((0, helmet_1.default)());
    app.use((0, cookie_parser_1.default)());
    app.use((0, compression_1.default)());
    app.use((0, express_rate_limit_1.default)({
        windowMs: 15 * 60 * 1000,
        max: 100,
        message: 'Too many requests, please try again later.',
    }));
    app.enableCors({
        origin: [frontendUrl],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    await app.listen(port);
    logger.log(`Application running on port ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map