import express from 'express';
import {registeredUser, loginUser, userCredits} from '../controllers/userControllers.js';
import userAuth from '../middlewares/auth.js';

const userRouter = express.Router();

userRouter.post('/register', registeredUser);
userRouter.post('/login', loginUser);
userRouter.get('/credits',userAuth, userCredits);

export default userRouter;