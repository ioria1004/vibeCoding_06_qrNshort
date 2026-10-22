const urlInput = document.getElementById("url-input");
const shortenBtn = document.getElementById("shorten-btn");
const shortOutput = document.getElementById("short-output");
const copyBtn = document.getElementById("copy-btn");
const resultRow = document.getElementById("result-row");
const message = document.getElementById("message");
const toast = document.getElementById("toast");

// 입력 필드가 비어 있으면 단축하기 버튼 비활성화
urlInput.addEventListener("input", () => {
  shortenBtn.disabled = urlInput.value.trim() === "";
});

// http(s)가 없으면 https를 붙여줌
function normalizeUrl(value) {
  let url = value.trim();
  if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url;
  }
  return url;
}

// URL 단축 OpenAPI 호출
// 브라우저에서 직접 호출해야 하므로 CORS를 허용하는 서비스를 사용함
// is.gd가 안 되면 clck.ru, v.gd 순서로 다시 시도
async function requestShortUrl(longUrl) {
  const encoded = encodeURIComponent(longUrl);

  const apis = [
    {
      name: "is.gd",
      url: "https://is.gd/create.php?format=json&url=" + encoded,
      read: async (res) => {
        const data = await res.json();
        if (!data.shorturl) throw new Error(data.errormessage || "단축 실패");
        return data.shorturl;
      }
    },
    {
      name: "clck.ru",
      url: "https://clck.ru/--?url=" + encoded,
      read: async (res) => {
        const text = (await res.text()).trim();
        if (!text.startsWith("http")) throw new Error("단축 실패");
        return text;
      }
    },
    {
      name: "v.gd",
      url: "https://v.gd/create.php?format=json&url=" + encoded,
      read: async (res) => {
        const data = await res.json();
        if (!data.shorturl) throw new Error(data.errormessage || "단축 실패");
        return data.shorturl;
      }
    }
  ];

  let lastError = null;
  for (const api of apis) {
    try {
      const res = await fetch(api.url);
      if (!res.ok) throw new Error(api.name + " 응답 오류 " + res.status);
      return await api.read(res);
    } catch (e) {
      console.warn(api.name + " 실패:", e.message);
      lastError = e;
    }
  }
  throw lastError || new Error("단축 실패");
}

shortenBtn.addEventListener("click", async () => {
  const longUrl = normalizeUrl(urlInput.value);
  if (!longUrl) return;

  shortenBtn.disabled = true;
  shortenBtn.textContent = "단축 중...";
  message.textContent = "";

  try {
    const shortUrl = await requestShortUrl(longUrl);
    shortOutput.value = shortUrl;
    resultRow.classList.add("active");
    message.textContent = "원본: " + longUrl;
  } catch (e) {
    shortOutput.value = "";
    resultRow.classList.remove("active");
    message.textContent = "URL 단축에 실패했습니다. 주소를 확인하고 다시 시도해 주세요.";
  } finally {
    shortenBtn.textContent = "단축하기";
    shortenBtn.disabled = urlInput.value.trim() === "";
  }
});

// Enter 키로도 단축
urlInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !shortenBtn.disabled) shortenBtn.click();
});

// 복사 버튼: 클립보드에 복사하고 알림 표시
copyBtn.addEventListener("click", async () => {
  const value = shortOutput.value;
  if (!value) return;

  try {
    await navigator.clipboard.writeText(value);
  } catch (e) {
    // 클립보드 API가 안 되는 경우
    shortOutput.select();
    document.execCommand("copy");
  }
  showToast();
});

function showToast() {
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}
