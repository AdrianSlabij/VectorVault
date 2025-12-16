import jwt
from fastapi import HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import os
from dotenv import load_dotenv
load_dotenv()

# 1. Initialize the security scheme
security = HTTPBearer()

# 2. Set your Supabase JWT Secret (Store this in an .env file in production!)
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")
if not SUPABASE_JWT_SECRET:
    raise ValueError("Missing SUPABASE_JWT_SECRET in .env file")

def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)):
    """
    Decodes the Supabase JWT and returns the User ID (sub).
    """
    token = credentials.credentials

    try:
        # 3. Decode the token using the secret
        # Supabase uses HS256 by default.
        # We verify the signature to ensure the token wasn't tampered with.
        payload = jwt.decode(
            token, 
            SUPABASE_JWT_SECRET, 
            algorithms=["HS256"],
            audience="authenticated" # Supabase auth tokens usually have this audience
        )
        
        # 4. Extract the user ID (the 'sub' field stands for 'subject')
        user_id = payload.get("sub")
        
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="Token contains no user ID"
            )
            
        return user_id

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Token has expired"
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid token"
        )