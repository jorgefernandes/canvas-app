class KycCamera {
    constructor(facingMode = 'user', cropWidth = 247, cropHeight = 318, videoId, canvasId, takePhotoId) {
        this.facingMode = facingMode;
        this.cropWidth = cropWidth;
        this.cropHeight = cropHeight;
        this.video = document.getElementById(videoId);
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext('2d');
        this.takePhotoButton = document.getElementById(takePhotoId);
        this.handleTakeButton = this.handleTakeButton.bind(this);
    }

    stopCamera() {
        if (this.video.srcObject) {
            this.video.srcObject.getTracks().forEach(track => track.stop());
            this.video.srcObject = null;
        }

        this.video.style.transform = ''; // Remove espelhamento ao parar
        this.takePhotoButton.removeEventListener('click', this.handleTakeButton);
        this.video.onloadedmetadata = null; // Remove event listener
    }

    afterTakePicture(photoDataUrl) {}

    handleTakeButton() {
        const videoWidth = this.video.videoWidth;
        const videoHeight = this.video.videoHeight;
        const cropWidth = this.cropWidth;
        const cropHeight = this.cropHeight;

        // Dimensões visíveis do vídeo
        const displayWidth = this.video.clientWidth;
        const displayHeight = this.video.clientHeight;

        // Escala proporcional
        const scaleY = videoHeight / displayHeight;
        const scaleX = scaleY; // Mantemos a proporção

        // Ajuste para centralizar o recorte
        const offsetX = (videoWidth - (cropWidth * scaleX)) / 2;
        const offsetY = (videoHeight - (cropHeight * scaleY)) / 2;

        // Define o tamanho do canvas
        this.canvas.width = cropWidth;
        this.canvas.height = cropHeight;

        // Limpa antes de desenhar
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.context.save();

        // **Corrige o espelhamento da imagem capturada**
        if (this.facingMode === 'user') {
            this.context.translate(cropWidth, 0);
            this.context.scale(-1, 1);
        }

        // Desenha a imagem recortada e escalada corretamente
        this.context.drawImage(
            this.video,
            offsetX, offsetY, cropWidth * scaleX, cropHeight * scaleY,
            0, 0, cropWidth, cropHeight
        );

        this.context.restore();

        // Converte para base64
        const photoDataUrl = this.canvas.toDataURL('image/jpeg');

        this.afterTakePicture(photoDataUrl);
    }

    setCanvasDimensions() {
        this.canvas.width = this.video.videoWidth;
        this.canvas.height = this.video.videoHeight;
    }

    async startCamera(cbSuccess = () => {}, cbError = () => {}) {
        try {
            // Se já há uma câmera ativa, evita reabrir
            if (this.video.srcObject) {
                return cbSuccess();
            }

            const constraints = {
                video: {
                    facingMode: this.facingMode,
                    width: { ideal: 640 },
                    height: { ideal: 480 }
                }
            };

            this.video.srcObject = await navigator.mediaDevices.getUserMedia(constraints);

            this.video.onloadedmetadata = () => {
                this.setCanvasDimensions();
                this.takePhotoButton.addEventListener('click', this.handleTakeButton);

                if (this.facingMode === 'user') {
                    this.video.style.transform = 'scaleX(-1)'; // Espelha apenas a frontal
                } else {
                    console.log(this.facingMode);
                    this.video.style.transform = 'scaleX(1)'; // Garante que a traseira não seja invertida
                }
            };

            cbSuccess();
        } catch (error) {
            console.error('Erro ao acessar a câmera:', error);
            cbError(error);
        }
    }
}

export default KycCamera;
