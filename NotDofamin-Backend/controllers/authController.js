const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'your_secret_key'; // Жестко закодированный секретный ключ

exports.register = async (req, res) => {
  const { nickname, password } = req.body;

  if (!nickname || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const nicknameExists = await User.findOne({ nickname });
    if (nicknameExists) {
      return res.status(400).json({ error: 'Nickname already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ nickname, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Error registering user' });
  }
};

exports.login = async (req, res) => {
  const { nickname, password } = req.body;

  try {
    const user = await User.findOne({ nickname });
    if (!user) {
      return res.status(400).json({ error: 'Invalid nickname or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid nickname or password' });
    }

    const token = jwt.sign({ userId: user._id, nickname: user.nickname }, SECRET_KEY, {
      expiresIn: '1h',
    });
    res.status(200).json({ token, nickname: user.nickname, userId: user._id }); // Возвращаем userId
  } catch (error) {
    res.status(400).json({ error: 'Error logging in' });
  }
};

exports.authenticate = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Auth Error' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(500).send({ message: 'Invalid Token' });
  }
};
