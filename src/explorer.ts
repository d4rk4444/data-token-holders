import { request, gql } from 'graphql-request';

export const getHoldersCount = async(network: string, date: string, tokenAddress: string, amountMore: string) => {
    const query = gql`
      {
        EVM(dataset: archive, network: ${network}) {
          TokenHolders(
            date: "${date}" 
            tokenSmartContract: "${tokenAddress}"
            where: {Balance: {Amount: {ge: "${amountMore}"}}}
          ) {
            uniq(of: Holder_Address)
          }
        }
      }
    `;

    const endpoint = 'https://streaming.bitquery.io/graphql';
    const response = await request(endpoint, query);

    return response.EVM.TokenHolders[0].uniq;
}