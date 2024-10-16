// 계정 생성 및 저장: 회원 가입 완료 #2
// 회원 정보 입력: 아이디 중복 검사 #3
// 회원 정보 입력: 비밀번호 재입력 일치 검사 #4
// 회원 정보 입력: 회원 정보 공란 검사 #5
describe('Signup Page Test', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/signup');
    
    // mocking
    cy.intercept('POST', '/api/auth/signup', (req) => {
      const { loginId } = req.body;
  
      // 중복된 ID에 대한 응답을 가정
      if (loginId === 'test_duplicated') {
        req.reply({
          statusCode: 400,
          body: '이미 존재하는 ID 입니다.',
        });
      } else {
        // 성공적인 응답 가정
        req.reply({
          statusCode: 200,
          body: { message: '회원가입이 완료되었습니다.' },
        });
      }
    }).as('signupRequest');
  });

  it('should successfully move to login page', () => {
    // #1 'Back to login' 버튼을 누를 시
    cy.get('.gotoLoginBtn').click();
    // 로그인 페이지로 이동
    cy.url().should('include', '/login');
  });

  it('should successfully signup with valid data', () => {
    // #2 올바른 회원 정보 입력 시
    cy.get('input[name="firstName"]').type('testFirstName');
    cy.get('input[name="lastName"]').type('testLastName');
    cy.get('input[name="id"]').type('testId');
    cy.get('input[name="password"]').type('testPw');
    cy.get('input[name="cPassword"]').type('testPw');

    // 패스워드 일치 시 성공 아이콘 확인
    cy.get('.icon.success').should('be.visible');

    // 폼 제출 시 회원가입 성공 후 로그인 페이지로 이동
    cy.get('.SignupBtn').click();
    cy.wait('@signupRequest');
    cy.get('.message-modal-content')
    .should('be.visible')
    .and('contain', '회원가입이 완료되었습니다.');
    cy.get('.message-modal-content').contains('Close').click();
    cy.url().should('include', '/login');
  });

  it('should show error for duplicated ID', () => {
    // #3 기존에 가입한 ID와 중복되는 ID 입력 시 
    cy.get('input[name="firstName"]').type('testFirstName');
    cy.get('input[name="lastName"]').type('testLastName');
    cy.get('input[name="id"]').type('test_duplicated');
    cy.get('input[name="password"]').type('testPw');
    cy.get('input[name="cPassword"]').type('testPw');

    // 폼 제출 시 오류 
    cy.get('.SignupBtn').click();
    cy.get('.message-modal-content') 
    .should('be.visible') 
    .and('contain', '이미 존재하는 ID 입니다.');
  });

  it('should show error when passwords do not match', () => {
    // #4 'Password'와 'Confirm Password'를 다르게 입력 시
    cy.get('input[name="firstName"]').type('testFirstName');
    cy.get('input[name="lastName"]').type('testLastName');
    cy.get('input[name="id"]').type('testId');
    cy.get('input[name="password"]').type('testPw');
    cy.get('input[name="cPassword"]').type('differentTestPw');

    // 패스워드 불일치 시 오류 아이콘 및 메시지 확인
    cy.get('.icon.error').should('be.visible');
    cy.get('.signupError').should('contain', 'Passwords do not match');

    // 폼 제출 시 오류
    cy.get('.SignupBtn').click();
    cy.get('.message-modal-content') 
    .should('be.visible') 
    .and('contain', '모든 필드를 올바르게 입력해 주세요.');
  });

  it('should show error when required fields are missing', () => {
    // #5 입력하지 않고 버튼 클릭 시
    cy.get('.SignupBtn').click();
    cy.get('.message-modal-content') 
    .should('be.visible') 
    .and('contain', '모든 필드를 올바르게 입력해 주세요.');
    cy.get('.message-modal-content').contains('Close').click();

    // 이름을 입력하지 않은 경우
    cy.visit('http://localhost:3000/signup');
    cy.get('input[name="id"]').type('testId');
    cy.get('input[name="password"]').type('testPw');
    cy.get('input[name="cPassword"]').type('testPw');
    cy.get('.SignupBtn').click();
    cy.get('.message-modal-content') 
    .should('be.visible') 
    .and('contain', '모든 필드를 올바르게 입력해 주세요.');
    cy.get('.message-modal-content').contains('Close').click();

    // 아이디를 입력하지 않은 경우
    cy.visit('http://localhost:3000/signup');
    cy.get('input[name="firstName"]').type('testFirstName');
    cy.get('input[name="lastName"]').type('testLastName');
    cy.get('input[name="password"]').type('testPw');
    cy.get('input[name="cPassword"]').type('testPw');
    cy.get('.SignupBtn').click();
    cy.get('.message-modal-content') 
    .should('be.visible') 
    .and('contain', '모든 필드를 올바르게 입력해 주세요.');
    cy.get('.message-modal-content').contains('Close').click();

    // 비밀번호를 입력하지 않은 경우
    cy.visit('http://localhost:3000/signup');
    cy.get('input[name="firstName"]').type('testFirstName');
    cy.get('input[name="lastName"]').type('testLastName');
    cy.get('input[name="id"]').type('testId');
    cy.get('input[name="cPassword"]').type('testPw');
    cy.get('.SignupBtn').click();
    cy.get('.message-modal-content') 
    .should('be.visible') 
    .and('contain', '모든 필드를 올바르게 입력해 주세요.');
    cy.get('.message-modal-content').contains('Close').click();

    // 비밀번호 재설정을 입력하지 않은 경우
    cy.visit('http://localhost:3000/signup');
    cy.get('input[name="firstName"]').type('testFirstName');
    cy.get('input[name="lastName"]').type('testLastName');
    cy.get('input[name="id"]').type('testId');
    cy.get('input[name="password"]').type('testPw');
    cy.get('.SignupBtn').click();
    cy.get('.message-modal-content') 
    .should('be.visible') 
    .and('contain', '모든 필드를 올바르게 입력해 주세요.');
    cy.get('.message-modal-content').contains('Close').click();
  });
});