// src/modules/imports/components/PreviewTable.tsx
export const PreviewTable = () => {
  return (
    <div>
      {/* Placeholder for table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-muted-foreground">
          <thead>
            <tr>
              <th scope="col" className="px-6 py-3">
                Nome
              </th>
              <th scope="col" className="px-6 py-3">
                E-mail
              </th>
              <th scope="col" className="px-6 py-3">
                Telefone
              </th>
              <th scope="col" className="px-6 py-3">
                Data de Nascimento
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="px-6 py-4 whitespace-nowrap">
                João Silva
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                joao.silva@email.com
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                (11) 99999-9999
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                15/03/1990
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};