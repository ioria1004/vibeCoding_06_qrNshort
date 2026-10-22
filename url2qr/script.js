document.addEventListener("DOMContentLoaded", () => {
  const urlInput = document.getElementById("url-input");
  const makeBtn = document.getElementById("make-btn");
  const inputArea = document.getElementById("input-area");
  const qrArea = document.getElementById("qr-area");
  const qrBox = document.getElementById("qrcode");

  // 주소에 http(s)가 없으면 https를 붙여줌
  function normalizeUrl(value) {
    let url = value.trim();
    if (url && !/^https?:\/\//i.test(url)) {
      url = "https://" + url;
    }
    return url;
  }

  // QR코드 만들기
  function makeQR() {
    const url = normalizeUrl(urlInput.value);
    if (!url) {
      alert("URL을 입력해 주세요.");
      urlInput.focus();
      return;
    }

    try {
      qrBox.innerHTML = "";
      new QRCode(qrBox, {
        text: url,
        width: 280,
        height: 280,
        colorDark: "#1e293b",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });

      // 입력창은 아래로, QR코드는 가운데로
      inputArea.classList.remove("center");
      inputArea.classList.add("bottom");
      qrArea.classList.remove("hidden");
    } catch (e) {
      console.error(e);
      alert("QR코드 생성 중 오류가 발생했습니다.");
    }
  }

  makeBtn.addEventListener("click", makeQR);
  urlInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") makeQR();
  });

  // QR코드 클릭 -> jpg 파일로 다운로드
  qrBox.addEventListener("click", () => {
    const canvas = qrBox.querySelector("canvas");
    if (!canvas) return;

    // jpg는 투명 배경이 없으므로 흰 배경 위에 다시 그림
    const out = document.createElement("canvas");
    const pad = 20;
    out.width = canvas.width + pad * 2;
    out.height = canvas.height + pad * 2;
    const ctx = out.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, out.width, out.height);
    ctx.drawImage(canvas, pad, pad);

    const link = document.createElement("a");
    link.href = out.toDataURL("image/jpeg", 0.95);
    link.download = "qrcode.jpg";
    document.body.appendChild(link);
    link.click();
    link.remove();
  });

  // 마우스 위치에 따라 배경 그라데이션 색이 조금씩 바뀜
  document.addEventListener("mousemove", (e) => {
    const x = Math.round((e.clientX / window.innerWidth) * 100);
    const y = Math.round((e.clientY / window.innerHeight) * 100);
    document.body.style.setProperty("--mx", x + "%");
    document.body.style.setProperty("--my", y + "%");
  });
});
