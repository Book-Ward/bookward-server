const {createClient} = require('@supabase/supabase-js')

function getToken(req) {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  } 
  return null;
}

const supabase_middleware = async (req, res) => {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {})
  const JWT = getToken(req)

  switch(JWT){
    case null:
        console.error('no JWT parsed')
        break;

    default:
      const { data, error } = await supabase.auth.getUser(JWT)

      return { data, error };
  }
}

module.exports = supabase_middleware