import navigate from "./navigate.js";
import {setSpinner} from "./useSpinner.js";
import {displayModal} from "./displayModal.js";
/**
 * Inicia a navegação o KYC gerando token a partir da URL do usuário
 */
(async function () {
    const uri = `${apiBaseUrl}${window.location.pathname}${window.location.search}`;

    try {
        setSpinner(true);
        const response = await window.axios.post('/oauth/token', {
            grant_type: 'url_autenticada',
            uri
        })

        // Para que todas as chamadas do fluxo recebam o token
        window.axios.defaults.headers['Authorization'] = `${response.data.token_type} ${response.data.access_token}`

        // Apresenta a tela de entrada
        navigate('baterSelfie');
    } catch (e) {
        console.error(e);
        displayModal(e.response.data.message);
    } finally {
        setSpinner(false);
    }
}())
