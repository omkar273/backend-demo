// Import the necessary modules from Express and your User model
import { IUser } from './src/models/user/user.model';

declare module 'express' {
    export interface Request {
        user?: IUser;
        role: string;
    }
}
