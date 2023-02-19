function getToken(req) {
  // If the token is not present and it is not Bearer
  if (!(req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer")) {
      
    return null;
  } 
  
  return req.headers.authorization.split(" ")[1];
}

const supabase_middleware = async (req, res, next) => {
  
  const supabase = req.app.get('supabase')

  const JWT = getToken(req)

  if (!JWT) {
    console.error('No JWT parsed')

    next();
    return;
  }
 
  res.locals.data = await supabase.auth.getUser(JWT)

  next();
}

module.exports = supabase_middleware