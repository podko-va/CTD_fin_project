let chai_obj = null;

const get_chai = async () => {
  console.log('Starting get_chai function');
  console.log('Initial chai_obj:', chai_obj);

  if (!chai_obj) {
    console.log('Creating new chai_obj...');
    
    try {
      console.log('Importing chai...');
      const { expect, use } = await import("chai");
      console.log('Chai imported successfully');
      console.log('expect type:', typeof expect);
      
      console.log('Importing chai-http...');
      const chaiHttp = await import("chai-http");
      console.log('chai-http imported successfully');
      console.log('chaiHttp.default:', typeof chaiHttp.default);
      
      console.log('Using chai-http plugin...');
      const chai = use(chaiHttp.default);
      console.log('chai after plugin:', typeof chai);
      console.log('chai.request type:', typeof chai.request);
      
      chai_obj = { 
        expect: expect, 
        request: chai.request 
      };
      
      console.log('Created chai_obj with properties:');
      console.log('- expect:', typeof chai_obj.expect);
      console.log('- request:', typeof chai_obj.request);
      
      // Проверяем методы request
      console.log('\nAvailable request methods:');
      console.log(Object.keys(chai_obj.request));
      
      // Проверяем, является ли request функцией
      if (typeof chai_obj.request === 'function') {
        console.log('\nrequest is a function with properties:');
        console.log(Object.keys(chai_obj.request));
      }
      
    } catch (error) {
      console.error('Error in get_chai:', error);
      throw error;
    }
  } else {
    console.log('Using existing chai_obj');
  }
  
  console.log('\nReturning chai_obj with types:');
  console.log({
    expect: typeof chai_obj.expect,
    request: typeof chai_obj.request
  });
  
  return chai_obj;
};

// Тестовый запуск
const testGetChai = async () => {
  console.log('=== Testing get_chai ===');
  try {
    const chai = await get_chai();
    console.log('\nTest request capabilities:');
    if (chai.request) {
      console.log('- request is present');
      console.log('- request type:', typeof chai.request);
      if (typeof chai.request === 'function') {
        console.log('- request appears to be properly initialized');
      }
    } else {
      console.log('WARNING: request is not present in chai object');
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Раскомментируйте следующую строку для тестового запуска
// testGetChai();

module.exports = get_chai;