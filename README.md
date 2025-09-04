# CHIC 에브리타임 웹 페이지 클론코딩 프로젝트

Node.js와 Express.js를 사용한 에브리타임 웹 페이지 클론코딩 프로젝트의 백엔드 API 서버입니다.

## 🚀 빠른 시작

### 사전 요구사항

- **Node.js**
- **npm**
- **MongoDB Atlas** 계정 (또는 로컬 MongoDB)

### 1. 프로젝트 클론 및 의존성 설치

```bash
# 프로젝트 클론 (또는 다운로드)
git clone https://github.com/Chic-Toy-Project-React-Node/Node.git
cd Node

# 의존성 설치
npm install
```

### 2. MongoDB Atlas 설정

#### 2.1 MongoDB Atlas 계정 생성 및 클러스터 설정

1. [MongoDB Atlas](https://www.mongodb.com/atlas) 에 가입/로그인
2. 새 프로젝트 생성
3. 무료 클러스터(M0 Sandbox) 생성
4. 클러스터 이름 설정
5. 클라우드 제공업체 및 지역 선택 (가장 가까운 지역 권장)

#### 2.2 데이터베이스 사용자 생성

1. Database Access 메뉴에서 "Add New Database User" 클릭
2. Authentication Method: Password 선택
3. 사용자명과 비밀번호 설정 (예: `admin` / `your_password`)
4. Database User Privileges: "Atlas admin" 선택
5. "Add User" 클릭

#### 2.3 네트워크 액세스 설정

1. Network Access 메뉴에서 "Add IP Address" 클릭
2. "Allow Access from Anywhere" 선택
   - 또는 특정 IP 주소 설정
3. "Confirm" 클릭

#### 2.4 연결 문자열 획득

1. Clusters 메뉴에서 "Connect" 버튼 클릭
2. "Connect your application" 선택
3. Driver: Node.js, Version: 4.1 or later 선택
4. 연결 문자열 복사 (예시):
   ```
   mongodb+srv://<username>:<password>@university-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### 3. 환경변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 입력하세요:

```bash
# MongoDB 설정
MONGODB_URI=mongodb+srv://admin:your_password@university-cluster.xxxxx.mongodb.net/university_db?retryWrites=true&w=majority

# 서버 설정
PORT=3000

# JWT 설정 (인증용)
JWT_SECRET=암거나입력하세요
```

이때 MONGODB_URI에는 복사한 연결 문자열 추가해주시고,
문자열 내에서 `<password>` 부분을 2-2에서 생성했던 사용자 비밀번호로 변경해주세요.

### 4. MongoDB 연결 테스트

```bash
# MongoDB 연결 상태 확인
npm run check-mongo
```

성공적으로 연결되면 다음과 같은 메시지가 출력됩니다:

```
🔍 MongoDB 연결 시도 중...
📍 연결 URI: mongodb+srv://...
🍃 MongoDB 연결 성공: university-cluster-shard-00-00.xxxxx.mongodb.net
📦 데이터베이스: university_db
✅ Mongoose가 MongoDB에 연결되었습니다.
```

### 5. 서버 실행

```bash
# 개발 모드 (nodemon 사용 - 파일 변경 시 자동 재시작)
npm run dev

# 또는 프로덕션 모드
npm start
```

서버가 성공적으로 시작되면:

```
🚀 서버가 포트 3000에서 실행 중입니다.
📍 환경: development
🌐 URL: http://localhost:3000
```

### 6. API 테스트

브라우저에서 `http://localhost:3000`에 접속하면 다음 응답을 확인할 수 있습니다:

```json
{
  "message": "Express 서버가 정상적으로 실행되고 있습니다!",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development"
}
```

## 📚 API 문서

### Swagger UI 문서

서버 실행 후 `http://localhost:3000/api-docs`에서 인터랙티브한 API 문서를 확인할 수 있습니다.
