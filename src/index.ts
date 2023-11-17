import Express, { NextFunction, Request, Response } from 'express'
import { ValidationError } from 'yup';
import { v4 as uuidv4 } from 'uuid';


import { createPersonSchema, updatePersonSchema } from './validation'
import db from './db'

import {User} from './types';
import {Course} from './types';
import {StudentCourse} from './types';
import {Student} from './types';
import {Admin} from './types';




const app = Express()


app.use(Express.json());

// Get all persons


const users = app.get('/users', async (req, res) => {

  // Load data from db.json into db.data
  await db.read();

  res.json(db.data.users);

})

// 1. Get person by id from DB

app.get('/users/:id', async (req, res) => {
  const id = parseInt(req.params.id)

  // Load data from db.json into db.data
  await db.read()
  const user = db.data.users.find(user => user.id === id)
  if (!user) {
    res.sendStatus(404)
    return
  }
  res.json(user)
}
)
const validateSchema = (schema: any) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await schema.validate(req.body, {abortEarly: false});
    next();
  } catch (error) {
    if (error instanceof ValidationError) {
      console.log(error.errors);
      res.status(400).json({message: error.errors})
    }
  }
}

// 2. POST

app.post('/users', async (req, res) => {
  const user = req.body
  await db.read()
  const lastCreatedUser = db.data.users[db.data.users.length - 1]
  const id = lastCreatedUser ? lastCreatedUser.id + 1 : 1
  db.data.users.push({ id, ...user })
  await db.write()
  res.json({ id })
})




// 3.
// PATCH /persons/:id with body { firstName: string, lastName: string }
// Update a person in DB
app.patch('/users/:id', validateSchema(updatePersonSchema), async (req, res) => {
  const id = parseInt(req.params.id)
  const updatedUser = req.body


  // Load data from db.json into db.data
  await db.read()

  const userIndex = db.data.users.findIndex(user => user.id === id)
  if (userIndex === -1) {
    res.sendStatus(404)
    return
  }


  db.data.users[userIndex] = { ...db.data.users[userIndex], ...updatedUser }


  // Save data from db.data to db.json file
  await db.write()

  res.sendStatus(204)
})

// 4. Qu'est-ce qu'une API REST ?
// En 2-3 slides que faut-il retenir ?
// Quelle association entre les verbes HTTP et les opérations CRUD ?
// Comment nommer les routes ? Singulier ou pluriel ? Majuscule ou minuscule ?
// Comment documenter une API REST ? Un package NPM ? Un site web ? Autre ? Avec Express ?

app.delete('/users/:id', async (req, res) => {

  const id = parseInt(req.params.id)
  await db.read()

const userIndex = db.data.users.findIndex(user => user.id === id)
  if (userIndex === -1) {
    res.sendStatus(404)
    return
  }

  db.data.users.splice(userIndex, 1)
  await db.write()
  res.sendStatus(204)
})

// Middleware d'authentification simple
const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // par exemple, en utilisant des tokens JWT.
  const isAdmin = req.headers.authorization === 'admin_token';

  if (!isAdmin) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  next();
};

// Ajouter un utilisateur (accessible uniquement par un admin)
app.post('/users', authenticate, (req, res) => {
  const newUser = { id: uuidv4(), ...req.body };
  db.get('users').push(newUser).write();
  res.json(newUser);
});

// Créer un cours (accessible uniquement par un admin)
app.post('/courses', authenticate, (req, res) => {
  const newCourse = { id: uuidv4(), ...req.body };
  db.get('courses').push(newCourse).write();
  res.json(newCourse);
});

// Ajouter un étudiant à un cours (accessible uniquement par un admin)
app.post('/courses/:courseId/students/:userId', authenticate, (req, res) => {
  const { courseId, userId } = req.params;
  const registeredAt = new Date().toISOString();
  const signedAt = null;

  const studentCourse = { id: uuidv4(), courseId, userId, registeredAt, signedAt };

  db.get('studentCourses').push(studentCourse).write();
  res.json(studentCourse);
});

// Un étudiant signe pour montrer sa présence à un cours
app.post('/courses/:courseId/students/:userId/sign', (req, res) => {
  const { courseId, userId } = req.params;
  const signedAt = new Date().toISOString();

  // Mettez à jour l'heure de signature dans la base de données
  db.get('studentCourses')
    .find({ courseId, userId })
    .assign({ signedAt })
    .write();

  res.json({ message: 'Presence signed successfully' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});