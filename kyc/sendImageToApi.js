import {displayModal} from "./displayModal.js";
import {setSpinner} from "./useSpinner.js";

export async function uploadImage(cbSucces, cbError) {
    try {
        setSpinner(true);

        const baseSelfie = document.getElementById('baseSelfie');
        const base64DocumentoFrente = document.getElementById('base64DocumentoFrente');
        const base64DocumentoVerso = document.getElementById('base64DocumentoVerso');
        const base64Comprovante = document.getElementById('base64Comprovante');
        const urlParams = new URLSearchParams(window.location.search)

        await window.axios.post('/v1/me/kyc/captura/concluir', {
            "selfie": baseSelfie.value,
            "documento": base64DocumentoFrente.value,
            "documento_verso": base64DocumentoVerso.value,
            "comprovante_endereco": base64Comprovante.value,
            "provedor_id": urlParams.get('provider_id')
        });

        if(cbSucces) cbSucces();
    } catch (error) {
        console.error('Error sending photo to the API:', error);
        displayModal('Ocorreu um erro eu enviar a sua foto. Tente novamente.')
        if(cbError) cbError();
    } finally {
        setSpinner(false);
    }
}
