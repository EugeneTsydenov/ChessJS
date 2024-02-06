import {Router} from "express";
import {body} from "express-validator";
import userController from "../controllers/user-controller";
import {authMiddleware} from "../middlewares/auth-middleware";
import { emitSocketData } from "../services/socketService";
const router:Router = Router();

router.post('/login',
  body('email').isEmail(),
  body('password').isLength({min: 3, max: 8}),
  userController.login);
router.post('/registration',
  body('email').isEmail(),
  body('password').isLength({min: 3, max: 8}),
  userController.registration);
router.post('/logout', userController.logout);
router.get('/refresh', userController.refresh);
router.get('/user', authMiddleware, userController.getUser);
router.post('/test', (req, res, next) => {
  console.log(process.env.DATABASE_URL)
})
router.post('/play', authMiddleware, (req, res) => {
  emitSocketData('search', )
})
export default router