const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../app');

chai.use(chaiHttp);

describe('UI Tests for Appointments Application', () => {
  describe('GET /', () => {
    it('should render the main page with correct elements', (done) => {
      chai
        .request(app)
        .get('/')
        .end((err, res) => {
          if (err) {
            console.error('Test error:', err);
            done(err);
            return;
          }
          
          expect(res).to.have.status(200);
          expect(res).to.be.html;
          
          expect(res.text).to.include('<!DOCTYPE html>');
          expect(res.text).to.include('<html');
          expect(res.text).to.include('<head');
          expect(res.text).to.include('<body');
          
          expect(res.text).to.include('<title>WarmEmbrace</title>');
          
          done();
        });
    });
  });

  describe('GET /', () => {
    it('check if the main UI elements are present', (done) => {
      
      chai
        .request(app)
        .get('/')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.html;
          
          expect(res.text).to.include('<h1>Appointments List</h1>');
          expect(res.text).to.include('<button type="button" id="logon">logon</button>');
          expect(res.text).to.include('<div class="container">');
          expect(res.text).to.include('<button type="button" id="add-appointment">Add Appointment</button>');
          
          done();
        });
    });
});
});