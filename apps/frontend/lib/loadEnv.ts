import dotenv from 'dotenv'
// import path from "path";

// // Carrega variáveis do .env apenas no servidor (Node.js)
// // No cliente, o Next.js já injeta as variáveis NEXT_PUBLIC_* em process.env
// if (typeof window === 'undefined') {
//    const envPath = path.resolve(process.cwd(), '.env');
//    dotenv.config({ path: envPath });
// }

dotenv.config()

type TConfig = {
  API_BASE_URL: string
  PAGE_SIZE: number
}

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
if (!apiBaseUrl) {
  throw new Error(
    'NEXT_PUBLIC_API_BASE_URL is required but was not set. ' +
      'Please ensure it is defined in your .env file and restart the development server.',
  )
}

const pageSizeStr = process.env.NEXT_PUBLIC_PAGE_SIZE
const pageSize = pageSizeStr ? parseInt(pageSizeStr, 10) : 20

const config: TConfig = {
  API_BASE_URL: apiBaseUrl,
  PAGE_SIZE: pageSize,
}

export default config
