import {Provider} from 'oidc-provider';

 const getProvider = (ISSUER, configuration, adapter) => new Provider(ISSUER, { adapter, ...configuration });

export default getProvider;