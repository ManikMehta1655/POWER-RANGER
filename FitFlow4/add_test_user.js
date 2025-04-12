const users = [{name: 'Test User', username: 'test', password: 'test123'}];
localStorage.setItem('users', JSON.stringify(users));
console.log('Test user created');
