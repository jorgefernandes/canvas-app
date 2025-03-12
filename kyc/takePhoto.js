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

        // **Ajuste o fator de escala para aumentar a resolução**
        const scaleFactor = 7;

        // **Garante que a proporção original seja mantida**
        const aspectRatio = cropWidth / cropHeight;

        // Define a resolução maior mantendo a proporção correta
        const newWidth = cropWidth * scaleFactor;
        const newHeight = newWidth / aspectRatio;

        this.canvas.width = newWidth;
        this.canvas.height = newHeight;

        // Ajuste a escala corretamente para evitar distorção
        const scaleX = videoWidth / this.video.clientWidth;
        const scaleY = videoHeight / this.video.clientHeight;
        const scale = Math.min(scaleX, scaleY); // Mantém a proporção sem distorção

        // Centraliza o recorte no vídeo
        const offsetX = (videoWidth - cropWidth * scale) / 2;
        const offsetY = (videoHeight - cropHeight * scale) / 2;

        // Limpa o canvas antes de desenhar
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.context.save();

        // **Corrige o espelhamento da câmera frontal**
        if (this.facingMode === 'user') {
            this.context.translate(this.canvas.width, 0);
            this.context.scale(-1, 1);
        }

        this.context.imageSmoothingEnabled = true;
        this.context.imageSmoothingQuality = 'high';
        this.context.globalCompositeOperation = 'source-over';

        // **Desenha a imagem no tamanho maior mantendo a proporção**
        this.context.drawImage(
            this.video,
            offsetX, offsetY, cropWidth * scale, cropHeight * scale, // Mantém o recorte original
            0, 0, this.canvas.width, this.canvas.height // Amplia sem distorção
        );

        this.context.restore();

        // **Salva a imagem com qualidade máxima**
        const photoDataUrl = this.canvas.toDataURL('image/jpeg', 1.0); // 100% de qualidade

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
                    width: { ideal: 3840 }, // 4K se disponível
                    height: { ideal: 2160 },
                    advanced: [{ width: 4096, height: 2160 }] // Se disponível, usa 4K
                }
            };

            this.video.srcObject = await navigator.mediaDevices.getUserMedia(constraints);

            this.video.onloadedmetadata = () => {
                this.setCanvasDimensions();
                this.takePhotoButton.addEventListener('click', this.handleTakeButton);

                if (this.facingMode === 'user') {
                    this.video.style.transform = 'scaleX(-1)'; // Espelha apenas a frontal
                } else {
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
