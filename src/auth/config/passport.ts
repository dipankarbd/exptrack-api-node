import fs from 'fs';
import path from 'path';
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptionsWithoutRequest,
} from 'passport-jwt';

import { IGetUser } from '../../user';

const pubKeyPath = path.join(__dirname, '../../../', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pubKeyPath, 'utf8');

export const configurePassport = (repository: IGetUser) => {
  return (passport: any) => {
    const options: StrategyOptionsWithoutRequest = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: PUB_KEY,
      algorithms: ['RS256'],
      ignoreExpiration: false,
    };

    const strategy = new JwtStrategy(options, async (payload, done) => {
      const user = await repository.getUser(payload.sub);

      if (user) {
        return done(null, user);
      } else {
        return done('Unauthenticated User', false);
      }
    });

    passport.use(strategy);
  };
};
