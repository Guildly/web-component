import { gql } from "@apollo/client";

/** Template for guilds query by account. */
export const getGuildsByAccount = gql`
  query get_guilds_by_account($account: HexValue) {
    guilds(where: { account: { eq: $account } }) {

    }
  }
`;

/** Template for data query by account. */
export const getDataByContract = gql`
  query get_data_by_contract($contract: HexValue) {
    transactionResponse(where: { contract: { eq: $contract } }) {

    }
  }
`;
