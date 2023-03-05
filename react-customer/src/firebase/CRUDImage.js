// import firebase from 'firebase';
import { storage } from './firebaseConfig';
import { ref, getDownloadURL, listAll, uploadBytes, deleteObject } from "firebase/storage";
import Swal from 'sweetalert2';

// Function for user


// Function for product
// Up ảnh lên firebase
export async function uploadProductImage(productID, imageFile, imageType, imageName) {
  if (imageType === 'image360') {
    //upload vào thư mục ảnh 360 độ
    await uploadBytes(ref(storage, `products/p_${productID}/images360/${imageName}`), imageFile)
      .then(async snapshot => await getDownloadURL(snapshot.ref).then((downloadURL) => {
        console.log('URL GET', downloadURL, snapshot)
      }))
      .catch(err => console.log(err))
  }
  else if (imageType === 'image') {
    //upload vào thư mục ảnh bình thường
    await uploadBytes(ref(storage, `products/p_${productID}/images/${imageName}`), imageFile)
      .then(async snapshot => await getDownloadURL(snapshot.ref).then((downloadURL) => {
        console.log('URL GET', downloadURL, snapshot)
      }))
      .catch(err => console.log(err))
  }
  else {
    return -1;
  }

}

// Lấy link ảnh trên firebase
// Hàm này trả về mảng chứa danh sách image URL
export async function getProductListImageURL(productID) {
  // biến lưu danh sách URL và Ref
  let listImage = {
    images: [],
    listImageRef: [],
  };

  // Tạo vị trí lưu trữ trên storage và tham chiếu đến đó
  // Tham chiếu đến thư mục images
  await listAll(ref(storage, `products/p_${productID}/images`))
    .then(res => {
      res.items.forEach(item => {
        listImage.listImageRef.push(item);
      });
    })
    .catch(err => {
      console.log('err on get listImageRef:', err);
      return null;
    }
    );

  // Lưu link ảnh vào object listImage
  // Lưu vào listImage.images
  for (let i = 0; i < listImage.listImageRef.length; i++) {
    await getDownloadURL(listImage.listImageRef[i])
      .then(url => {
        listImage.images.push(url);
      })
      .catch(err => {
        console.log('err on get listImage.images:', err);
        return null;
      });
  }

  console.log('listImage:', listImage);
  return listImage;
}

// Hàm này trả về mảng chứa danh sách image360 URL
export async function getProductListImage360URL(productID) {
  // biến lưu danh sách URL và Ref
  let listImage = {
    images360: [],
    listImage360Ref: [],
  };

  // Tạo vị trí lưu trữ trên storage và tham chiếu đến đó
  // Tham chiếu đến thư mục images360
  await listAll(ref(storage, `products/p_${productID}/images360`))
    .then(res => {
      res.items.forEach(item => {
        listImage.listImage360Ref.push(item);
      });
    })
    .catch(err => {
      console.log('err on get listImage360Ref:', err);
      return null;
    }
    );

  // Lưu link ảnh vào object listImage
  // Lưu vào listImage.images360
  for (let i = 0; i < listImage.listImage360Ref.length; i++) {
    await getDownloadURL(listImage.listImage360Ref[i])
      .then(url => {
        listImage.images360.push(url);
      })
      .catch(err => {
        console.log('err on get listImage.images360:', err);
        return null;
      });
  }

  console.log('listImage360:', listImage);
  return listImage;
}

// Hàm này trả về image URL đầu tiên
export async function getProductFirstImageURL(productID) {
  // biến lưu danh sách URL và Ref
  let image = {
    imageURL: "",
    ImageRef: null,
  };

  // Tạo vị trí lưu trữ trên storage và tham chiếu đến đó
  // Tham chiếu đến thư mục images
  await listAll(ref(storage, `products/p_${productID}/images`))
    .then(res => {
      image.ImageRef = res.items[0];
    })
    .catch(err => {
      console.log('err on get image.ImageRef:', err);
      return null;
    }
    );
  console.log('image:', image);
  // Lưu link ảnh vào object listImage
  // Lưu vào listImage.images
  await getDownloadURL(image.ImageRef)
    .then(url => {
      image.imageURL = url;
    })
    .catch(err => {
      console.log('err on get image.imageURL:', err);
      return null;
    });

  console.log('image:', image);
  return image.imageURL;
}


// Xóa ảnh trên firebase
export async function deleteImage(imageFile) {
  await deleteObject(imageFile)
    .then(() => {
      Swal.fire({
        icon: 'success',
        showConfirmButton: false,
        timer: 1000,
        title: `Xóa ảnh ${imageFile.name} thành công!`
      });
    }).catch((err) => {
      console.log('err on deleteImage:', err);
    });
}

// Xóa tất cả ảnh trong một thư mục Images trên firebase
// với thư mục res của list all trả về ở key prefixes, không phải key items
// Tuy nhiên các firebase không thể delete đc các folder vì chúng trông giống folder chứ ko phải
export async function deleteAllImageInImages(productID) {
  let listImageRef = [];

  // Tham chiếu đến thư mục images
  await listAll(ref(storage, `products/p_${productID}/images`))
    .then(res => {
      console.log('res listAll:', res);
      res.items.forEach(item => {
        listImageRef.push(item);
      });
    })
    .catch(err => {
      console.log('err on listAll deleteAllImage:', err);
      return;
    }
    );

  console.log('listImageRef trước xóa', listImageRef);

  // Xóa các res trong listImageRef
  for (let i = 0; i < listImageRef.length; i++) {
    await deleteObject(listImageRef[i]);
  }

  console.log('Xóa xong listImageRef');
}

// Xóa tất cả ảnh trong một thư mục Images360 trên firebase
export async function deleteAllImageInImages360(productID) {
  let listImage360Ref = [];

  // Tham chiếu đến thư mục images360
  await listAll(ref(storage, `products/p_${productID}/images360`))
    .then(res => {
      console.log('res listAll360:', res);
      res.items.forEach(item => {
        listImage360Ref.push(item);
      });
    })
    .catch(err => {
      console.log('err on listAll deleteAllImage360:', err);
      return;
    }
    );

  console.log('listImage360Ref trước xóa', listImage360Ref);

  // Xóa các res trong listImage360Ref
  for (let i = 0; i < listImage360Ref.length; i++) {
    await deleteObject(listImage360Ref[i]);
  }

  console.log('Xóa xong listImage360Ref');
}