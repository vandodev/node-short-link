import postgres from "postgres"

// export const sql =   postgres("postgresql://docker@localhost:5432/shortlinks")
export const sql = postgres("postgresql://docker:docker@localhost:5432/shortlinks")