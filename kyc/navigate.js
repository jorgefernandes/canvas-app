
import KycCamera from './takePhoto.js';
import {uploadImage} from './sendImageToApi.js';
import { setSpinner } from './useSpinner.js';
import pdfDrawer from "./pdfDrawer.js";
import {removeNodeChildren} from "./removeNodeChildren.js";
import { displayModal } from './displayModal.js';

let kycCamera;
const navigate = (wrapperId, callback) => {
    const wrappers = document.querySelectorAll('[data-wrapper]');
    const showWrapper = document.getElementById(wrapperId);

    for (let wrapper of wrappers) {
        if(wrapper) {
            wrapper.style.display = 'none'
        }
    }

    if(showWrapper) {
        showWrapper.style.display = 'block';
    }

    if (callback) callback();

    navigateTo(wrapperId);

}

function handleInputFileChangeFrenteDoc(event) {
    const file = event.target.files[0];

    if (file && file.type === "application/pdf") {
        const fileReader = new FileReader();

        fileReader.onload = function(e) {
            pdfDrawer.init(e.target.result, 'photoDocumentFrente');

            appendBase64ToTextArea(e.target.result, 'base64DocumentoFrente')
            navigate('visualizaFrenteDocumento');
        };

        fileReader.readAsDataURL(file);
    } else {
        const fileReader = new FileReader();

        fileReader.onload = function(e) {
            appendBase64ToTextArea(e.target.result, 'base64DocumentoFrente')
            navigate('step4')
        };

        fileReader.readAsDataURL(file);
    }
}

function handleInputFileChangeVersoDoc(event) {
    const file = event.target.files[0];

    if (file && file.type === "application/pdf") {
        const fileReader = new FileReader();

        fileReader.onload = function(e) {
            pdfDrawer.init(e.target.result, 'photoDocumentVerso');

            appendBase64ToTextArea(e.target.result, 'base64DocumentoVerso')
            navigate('visualizaVersoDocumento');
        };

        fileReader.readAsDataURL(file);
    } else {
        const fileReader = new FileReader();

        fileReader.onload = function(e) {
            appendBase64ToTextArea(e.target.result, 'base64DocumentoVerso')
            navigate('visualizaVersoDocumento')
        };

        fileReader.readAsDataURL(file);
    }
}

function InputFileChangeComprovante(event) {
    const file = event.target.files[0];

    if (file && file.type === "application/pdf") {
        const fileReader = new FileReader();

        fileReader.onload = function(e) {
            pdfDrawer.init(e.target.result, 'photoComprovante');

            appendBase64ToTextArea(e.target.result, 'base64Comprovante')
            navigate('visualizaComprovante');
        };

        fileReader.readAsDataURL(file);
    } else {
        const fileReader = new FileReader();

        fileReader.onload = function(e) {
            appendBase64ToTextArea(e.target.result,  'base64Comprovante')
            navigate('visualizaComprovante')
        };

        fileReader.readAsDataURL(file);
    }
}

function handleUploadBase64() {
    uploadImage(() => {
        window.location = `${window.location.origin}/kyc/complete`;
    });
}

const navigateTo = (wrapperId) => {
    const toWrapper = document.querySelectorAll(`#${wrapperId} [data-navigate-to]`);

    toWrapper.forEach((el) => {
        el.removeEventListener('click', onClickNavigate);
    });

    toWrapper.forEach((el) => {
        el.addEventListener('click', onClickNavigate);
    });

    if(kycCamera && wrapperId !== 'baterSelfie' && wrapperId !== 'capturaFrenteDocumento' && wrapperId !== 'capturaVersoDocumento') {
        kycCamera.stopCamera();
    }

    if(wrapperId === 'baterSelfie') {

        const baseSelfie = document.getElementById('baseSelfie');

        baseSelfie.value = '';

        setCamera(
            'user',
            247,
            318,
            'videoSelfie',
            'canvasSelfie',
            'takePhotoSelfie',
            'visualizarSelfie',
            'photo',
            'baseSelfie'
        );
    }

    if(wrapperId === 'visualizarSelfie') {
        const salvarSelfie = document.getElementById('salvar-selfie');
        const photo = document.getElementById('photo');

        salvarSelfie.addEventListener('click', function () {
            navigate(this.dataset.navigateTo);
        });
    }

    if (wrapperId === 'capturaFrenteDocumento') {
        const uploadDocument = document.getElementById('uploadDocumentFrente');
        const photoDocumentFrente = document.getElementById('photoDocumentFrente');
        const base64DocumentoFrente = document.getElementById('base64DocumentoFrente');

        uploadDocument.value = '';
        photoDocumentFrente.style = null;
        removeNodeChildren(photoDocumentFrente);

        base64DocumentoFrente.value = '';

        uploadDocument.removeEventListener('change', handleInputFileChangeFrenteDoc);
        uploadDocument.addEventListener('change', handleInputFileChangeFrenteDoc);

        setCamera(
            'environment',
            327,
            477,
            'videoDocumentFrente',
            'canvasDocumentFrente',
            'takePhotoDocumentFrente',
            'visualizaFrenteDocumento',
            'photoDocumentFrente',
            'base64DocumentoFrente'
        );
    }

    if (wrapperId === 'capturaVersoDocumento') {

        const uploadDocument = document.getElementById('uploadDocumentVerso');
        const photoDocumentVerso = document.getElementById('photoDocumentVerso');
        const base64DocumentoVerso = document.getElementById('base64DocumentoVerso');

        uploadDocument.value = '';
        photoDocumentVerso.style = null;
        removeNodeChildren(photoDocumentVerso);
        base64DocumentoVerso.value = '';

        uploadDocument.removeEventListener('change', handleInputFileChangeVersoDoc);
        uploadDocument.addEventListener('change', handleInputFileChangeVersoDoc);

        setCamera(
            'environment',
            327,
            477,
            'videoDocumentVerso',
            'canvasDocumentVerso',
            'takePhotoDocumentVerso',
            'visualizaVersoDocumento',
            'photoDocumentVerso',
            'base64DocumentoVerso'
        );

        return;
    }

    if (wrapperId === 'capturaComprovante') {
        const uploadComprovante = document.getElementById('uploadComprovante');
        const photoComprovante = document.getElementById('photoComprovante');
        const base64Comprovante = document.getElementById('base64Comprovante');

        uploadComprovante.value = '';
        photoComprovante.style = null;
        removeNodeChildren(photoComprovante);
        base64Comprovante.value = '';

        uploadComprovante.removeEventListener('change', InputFileChangeComprovante);
        uploadComprovante.addEventListener('change', InputFileChangeComprovante);

        setCamera(
            'environment',
            327,
            477,
            'videoComprovante',
            'canvasComprovante',
            'takePhotoComprovante',
            'visualizaComprovante',
            'photoComprovante',
            'base64Comprovante'
        );
    }

    if (wrapperId === 'visualizaComprovante') {
        const sendImages = document.getElementById('send-images');

        sendImages.removeEventListener('click', handleUploadBase64);
        sendImages.addEventListener('click', handleUploadBase64);
    }
}

function onClickNavigate() {
    if (this.dataset.navigateTo === 'baterSelfie') {
        setSpinner(true);
        navigate(this.dataset.navigateTo);
    } else if (this.dataset.navigateTo === 'capturaFrenteDocumento') {
        navigate(this.dataset.navigateTo);
    } else {
        navigate(this.dataset.navigateTo);
    }
}

const setCamera = async (
    facingMode,
    cropWidth,
    cropHeight,
    videoId,
    canvasId,
    takePhotoId,
    navigateStep,
    photoContainer,
    textAreaId
) => {
    kycCamera = new KycCamera(
        facingMode,
        cropWidth,
        cropHeight,
        videoId,
        canvasId,
        takePhotoId
    );

    await kycCamera.startCamera(cbSuccess, cbError);

    function cbSuccess() {
        setSpinner(false);
    }

    function cbError(error) {
        if(error.name === 'NotAllowedError') {
            displayModal('Não é possível acessar a câmera. Por favor, certifique-se de ter concedido permissão.');
            navigate('welcome');
            setSpinner(false);
        } else if(error.name === 'NotFoundError') {
            displayModal('Dispositivo não encontrado');
            navigate('welcome');
            setSpinner(false);
        }
    }

    kycCamera.afterTakePicture = function (photoBase64) {
        kycCamera.stopCamera();
        navigate(navigateStep, function () {
            appendBase64(photoBase64, photoContainer);
            appendBase64ToTextArea(photoBase64, textAreaId);
        })
    }
}
function appendBase64ToTextArea(base64, textAreaId) {
    const base64Output = document.getElementById(textAreaId);

    base64Output.value = base64;
}
function appendBase64(base64, wrapperId) {
    const photoWrapper = document.getElementById(wrapperId);
    const image = new Image();
    image.src = base64;
    image.style.width = '100%';

    removeNodeChildren(photoWrapper);

    photoWrapper.appendChild(image);
}

export default navigate;






