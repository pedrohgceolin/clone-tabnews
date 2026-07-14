import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAtAndDatabaseStatus />
    </>
  );
}

function UpdatedAtAndDatabaseStatus() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let updatedAtText = "Carregando...";

  let databaseVersion = "Carregando...";

  let maxConnections = "Carregando...";

  let numConnections = "Carregando...";

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
    databaseVersion = data.postgres_version;
    maxConnections = data.max_connections;
    numConnections = data.used_connections;
  }

  return (
    <>
      <div>Ultima atualização: {updatedAtText}</div>
      <div>Versão do Banco de Dados: {databaseVersion}</div>
      <div>Número máximo de conexões: {maxConnections}</div>
      <div>Número de conexões ativas: {numConnections}</div>
    </>
  );
}
