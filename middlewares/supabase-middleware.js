const { createClient } = require('@supabase/supabase-js')

function getToken(req) {
  // If the token is not present and it is not Bearer
  if (!(req.headers.authorization &&
     req.headers.authorization.split(" ")[0] === "Bearer")) {
    return null;
  } 
  
  return req.headers.authorization.split(" ")[1];
}

const supabase_middleware = async (req, res, next) => {
  
  // TODO: Do not create client on every request
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {})

  const JWT = getToken(req)

  if (!JWT) {
    console.error('No JWT parsed')

    res.locals.data = null

    next();
  }

  res.locals.data = await supabase.auth.getUser(JWT)

  next();
}

module.exports = supabase_middleware