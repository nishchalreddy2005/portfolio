import imageCompression from "browser-image-compression"

export async function compressImage(
  file: File,
  options: {
    maxWidth?: number
    maxHeight?: number
    quality?: number
    maxSizeMB?: number
  } = {},
) {
  const { maxWidth = 800, maxHeight = 600, quality = 0.7, maxSizeMB = 1 } = options

  try {
    // First try to compress using browser-image-compression
    const compressedFile = await imageCompression(file, {
      maxSizeMB,
      maxWidthOrHeight: Math.max(maxWidth, maxHeight),
      useWebWorker: true,
      initialQuality: quality,
    })

    return compressedFile
  } catch (error) {
    console.error("Image compression failed:", error)

    // Fallback to canvas compression if the library fails
    return new Promise<File>((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement("canvas")
        let width = img.width
        let height = img.height

        // Calculate new dimensions while maintaining aspect ratio
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width)
          width = maxWidth
        }

        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height)
          height = maxHeight
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext("2d")
        ctx?.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Canvas to Blob conversion failed"))
              return
            }

            const newFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            })

            resolve(newFile)
          },
          "image/jpeg",
          quality,
        )
      }

      img.onerror = () => {
        reject(new Error("Image loading failed"))
      }

      img.src = URL.createObjectURL(file)
    })
  }
}

export async function isValidImageUrl(url: string): Promise<boolean> {
  // Check for common image hosting services that typically allow CORS
  const allowedDomains = [
    "imgur.com",
    "i.imgur.com",
    "cloudinary.com",
    "res.cloudinary.com",
    "unsplash.com",
    "images.unsplash.com",
    "githubusercontent.com",
    "raw.githubusercontent.com",
    "picsum.photos",
    "placehold.it",
    "placekitten.com",
    "dummyimage.com",
    "loremflickr.com",
    "vercel.app",
  ]

  try {
    // Check if URL is from a known good source
    const urlObj = new URL(url)
    const domain = urlObj.hostname

    if (allowedDomains.some((d) => domain.includes(d))) {
      return true
    }

    // For other URLs, we'll warn the user but still allow them
    return false
  } catch (e) {
    return false
  }
}

export function generatePlaceholderImage(width: number, height: number, text: string): string {
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")

  if (!ctx) return ""

  // Fill background
  ctx.fillStyle = "#f0f0f0"
  ctx.fillRect(0, 0, width, height)

  // Add text
  ctx.fillStyle = "#888888"
  ctx.font = "bold 16px Arial"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText(text, width / 2, height / 2)

  return canvas.toDataURL("image/png")
}
