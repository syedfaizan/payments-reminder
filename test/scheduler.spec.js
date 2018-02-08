const assert = require('assert');
const scheduler = require('../src/scheduler');
const sinon = require('sinon');
const axios = require('axios');

describe("It should  schedule messages to sent to customers at particular times", () => {
    const unpaidCustomer = {
        "email": "rforrester11@indiegogo.com",
        "text": "Hallo Ricki",
        "paid": false
    };

    beforeEach( () => {
        sinon.stub(scheduler, 'makeRequest').resolves(unpaidCustomer);
    });

    afterEach( () => {
        scheduler.makeRequest.restore();
    });

    it("should make a call to the makeRequest function", done => {
        scheduler.makeRequest(unpaidCustomer);
        assert(scheduler.makeRequest.calledOnce, true);
        done();
    });

    it("should resolve to a JSON object after POST'ing to localhost:9090", done => {
        scheduler.makeRequest(unpaidCustomer).then( res => {
            assert.equal(res.constructor.name, 'Object');
            done();
        });
    });

    it("should send a reminder to an customer", done => {
        assert.equal(unpaidCustomer.paid, false); // verify customer hasn't paid yet
        scheduler.makeRequest(unpaidCustomer)
            .then( res => {
                assert.equal(scheduler.makeRequest.calledOnce, true);
                assert.equal( res.email, unpaidCustomer.email );
                done();
            });
    });

    it('should tranform the schedule to make it into array of integers', () =>  {
        let customers = [{email:'syed@gmail.com', schedule: '0s-2s-3s'}, {email:'faizan@yahoo.com', schedule: '1s-4s'}];
        let expected = [{email:'syed@gmail.com', schedule: '0s-2s-3s', readableSchedule: [0,2,3]}, {email:'faizan@yahoo.com', schedule: '1s-4s', readableSchedule: [1,4]}];
        assert.deepEqual(scheduler.prepareJSON(customers), expected);
    });
});