import { ConfigService } from '@nestjs/config';
import { AwsConfig } from '../../config';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt } from 'passport-jwt';

export default function (config: ConfigService) {
  return {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    ignoreExpiration: false,
    _audience: config.get<AwsConfig>('aws').cognito.apiClientId,
    issuer: `https://cognito-idp.${
      config.get<AwsConfig>('aws').region
    }.amazonaws.com/${config.get<AwsConfig>('aws').cognito.apiUserPoolId}`,
    algorithms: ['RS256'],
    secretOrKeyProvider: passportJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://cognito-idp.${
        config.get<AwsConfig>('aws').region
      }.amazonaws.com/${
        config.get<AwsConfig>('aws').cognito.apiUserPoolId
      }/.well-known/jwks.json`,
    }),
  };
}
