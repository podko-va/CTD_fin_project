const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); 
const expect = chai.expect;


chai.use(chaiHttp);

describe('API Tests', () => {

  
  describe('POST /api/v1/auth/register', () => {
    it('should register a new user successfully', (done) => {
      const userData = {
        "name": 'Test User',
        "email": 'testuser@example.com',
        "password": 'securePassword123',
        "isPsychologist": false
      };

      chai.request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .end((err, res) => {
          expect(res).to.have.status(201); 
          expect(res.body).to.have.property('success', true);
          expect(res.body.data).to.have.property('email', userData.email);
          done();
        });
    });

    it('should return an error for missing data', (done) => {
      const incompleteData = {
        email: 'testuser@example.com'
      };

      chai.request(app)
        .post('/api/v1/auth/register')
        .send(incompleteData)
        .end((err, res) => {
          expect(res).to.have.status(400); 
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });

  
  describe('POST /api/v1/auth/registration', () => {
    it('should log in the user successfully', (done) => {
        const registrationData = {
            "name": "all5",
            "email": "alla315@gmail.com",
            "password": "secret",
            "isPsychologist": true
          };

      chai.request(app)
        .post('/api/v1/auth/registration')
        .send(registrationData)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('token'); 
          done();
        });
    });

    
    it('should return an error for invalid credentials', (done) => {
      const invalidLoginData = {
        email: 'testuser@example.com',
        password: 'wrongPassword'
      };

      chai.request(app)
        .post('/api/v1/auth/login')
        .send(invalidLoginData)
        .end((err, res) => {
          expect(res).to.have.status(401); 
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });
});
