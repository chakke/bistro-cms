import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ActionSheetController } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import * as firebase from 'firebase';

class FirebaseUpload {
  $key: string;
  file: File;
  name: string;
  url: string;
  path: string;
  progress: number;
  constructor(file: File) {
    this.file = file;
  }
}

interface FirebaseFolder {
  id?: string;
  name: string;
  path: string;
}

interface FirebaseFile {
  id?: string;
  name: string;
  folder: string;
  path: string;
  url: string;
  content_type: string;
  is_image?: boolean;
  storage_path?: string;
}



@IonicPage()
@Component({
  selector: 'page-firebase-storage',
  templateUrl: 'firebase-storage.html',
})
export class FirebaseStoragePage {

  mDirectoryCollectionPath: string = "storage/uploads/categories";
  mFilesCollectionPath: string = "storage/uploads/files";
  mStoragePath: string = "uploads";

  mDirectoryCollectionRef: AngularFirestoreCollection<FirebaseFolder>;
  mFileCollectionRef: AngularFirestoreCollection<FirebaseFile>;

  mData: Array<FirebaseFolder> = [];
  mFolder: Array<FirebaseFolder> = [];
  mFolderItems: Array<string> = [];

  mFilesData: Array<FirebaseFile> = [];
  mFiles: Array<FirebaseFile> = [];


  mSelectedFolder: FirebaseFolder = {
    id: "",
    name: "",
    path: ""
  };

  mSelectedFile: FirebaseFile = {
    id: "",
    name: "",
    folder: "",
    path: "",
    url: "",
    content_type: "",
    is_image: false
  }
  constructor(public mActionSheetController: ActionSheetController, public mToastController: ToastController, public mAlertController: AlertController, public mAngularFirestore: AngularFirestore, public navCtrl: NavController, public navParams: NavParams) {
    this.mSelectedFolder = {
      id: "",
      name: "",
      path: this.mStoragePath
    };
  }

  ngAfterViewInit() {
    let delay: number = 100;
    if (this.navCtrl.getViews().length == 1) {
      delay = 2000;
    }
    delay = 0;

    setTimeout(() => { this._ConnectToFirebase(); }, delay);


  }


  onSelectedFolderChanged() {
    let rootPath = this.mSelectedFolder.path + "/";
    this.mFolder = this.mData.filter(item => {
      if (item.path.startsWith(rootPath) && (item.path.replace(rootPath, "").indexOf("/") == -1)) {
        return true;
      }
      return false;
    });

    this.mFolderItems = [];
    let path: string = this.mSelectedFolder.path;
    path = path.replace(this.mStoragePath, "");
    let items = path.split("/");
    items.forEach(item => {
      this.mFolderItems.push(item);
    });
    this.mFiles = [];
    setTimeout(() => {
      this.mFiles = this.mFilesData.filter(item => {
        return item.folder === this.mSelectedFolder.path;
      });
      this.mFiles.sort((a, b) => {
        var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase();
        if (nameA < nameB) //sort string ascending
          return -1;
        if (nameA > nameB)
          return 1;
        return 0;
      });
    }, 400);


    this.mSelectedFile = {
      id: "",
      name: "",
      folder: "",
      path: "",
      url: "",
      content_type: "",
      is_image: false
    }
  }

  _ConnectToFirebase() {
    this.mDirectoryCollectionRef = this.mAngularFirestore.collection(this.mDirectoryCollectionPath);
    this.mFileCollectionRef = this.mAngularFirestore.collection(this.mFilesCollectionPath);

    this.mDirectoryCollectionRef.snapshotChanges().subscribe(
      snapshot => {
        this.mData = [];
        snapshot.forEach(item => {
          let doc = item.payload.doc;
          if (doc.exists) {
            let data = doc.data();
            let folder: FirebaseFolder = {
              id: doc.id,
              name: data.name,
              path: data.path
            };
            this.mData.push(folder);
          }
        });
        this.mData.forEach(item => {
          item.name = item.path.split("/").pop();
        });
        this.onSelectedFolderChanged();
      }
    );

    this.mFileCollectionRef.snapshotChanges().subscribe(
      snapshot => {
        this.mFilesData = [];
        snapshot.forEach(item => {
          let doc = item.payload.doc;
          if (doc.exists) {
            let data = doc.data();
            let fileUploaded: FirebaseFile = {
              id: doc.id,
              name: data.name,
              path: data.path,
              url: data.url,
              folder: data.folder,
              content_type: data.content_type,
              is_image: false,
              storage_path: data.storage_path
            };

            if (fileUploaded.content_type && fileUploaded.content_type.startsWith('image/')) {
              fileUploaded.is_image = true;
            }
            this.mFilesData.push(fileUploaded);
          }
        });
        this.onSelectedFolderChanged();
      }
    );

  }

  _ShowToast(message: string, duration: number) {
    let toast = this.mToastController.create({
      message: message,
      duration: duration
    });
    toast.present();
  }

  _InvalidateFolderName(name: string): boolean {
    var pattern = new RegExp("[^0-9a-zA-Z-_]");
    return pattern.test(name);
  }

  filesToUpload: Array<FirebaseUpload> = [];
  selectedFiles: FileList;
  //=================FirebaseUpload file ==============
  onFilesChanged(event) {
    this.selectedFiles = event.target.files;
    for (let i = 0; i < this.selectedFiles.length; i++) {
      let upload = new FirebaseUpload(this.selectedFiles[i]);
      this.filesToUpload.push(upload);
    }
    this._CheckUploadFile();
  }
  _CheckUploadFile() {
    if (this.filesToUpload.length > 0) {
      let upload = this.filesToUpload.shift();
      this._UploadFile(upload);
    }
  }
  _UploadFile(upload: FirebaseUpload) {
    upload.path = this.mSelectedFolder.path + "/" + upload.file.name;

    let uploadTask = firebase.storage().ref(upload.path).put(upload.file);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        // upload in progress
        upload.progress = (snapshot['bytesTransferred'] / snapshot['totalBytes']) * 100;
      },
      (error) => {
        // upload failed
        console.log(error);
      },
      () => {
        // upload success
        upload.url = uploadTask.snapshot.downloadURL;
        upload.name = upload.file.name;

        this.mFileCollectionRef.add({
          name: upload.name,
          path: upload.path,
          url: upload.url,
          content_type: uploadTask.snapshot.metadata.contentType,
          folder: this.mSelectedFolder.path,
          storage_path: this.mSelectedFolder.path,
        });
        this._CheckUploadFile();
      }
    );
  }

  // =================== USER EVENT =================
  VIEW_LIST: number = 0;
  VIEW_TILES: number = 1;
  mViewType: number = 0;
  /**Thay đổi cách hiển thị file */
  onClickSwitchViewType() {
    this.mViewType = (this.mViewType + 1) % 2;
    console.log(this.mViewType);
  }

  onClickBack() {
    if (this.navCtrl.getViews().length > 1) {
      this.navCtrl.pop();
    } else {
      this.navCtrl.setRoot("HomePage");
    }
  }

  /**User muốn xóa File */
  onClickDeleteFile(file: FirebaseFile) {
    this._DeleteFile(file);
  }
  onClickRenameFile(file: FirebaseFile) {
    this._RenameFile(file);
  }
  onClickOpenFile(file: FirebaseFile) {
    this._OpenFile(file);
  }
  onDoubleClickFile(file: FirebaseFile, event) {
    if (event.tapCount == 1) {
      this.mSelectedFile = file;
    }
    if (event.tapCount == 2) {
      event.preventDefault();
      console.log("On Double tap File", file);
    }
  }
  onRightClickFile(file: FirebaseFile, event) {
    if (event.which == 3) {
      event.preventDefault();
      this._ShowFileContextMenu(file);
    }
  }

  /**User chuyển nhanh đến folder hiển thị ở topbar */
  onClickFolderBar(folderName: string) {
    if (folderName.length == 0) {
      this.mSelectedFolder = {
        id: "",
        name: "",
        path: this.mStoragePath
      };
    } else {
      this.mData.forEach(item => {
        if (item.path.startsWith(this.mStoragePath) && item.path.endsWith(folderName)) {
          this.mSelectedFolder = item;
        }
      });
    }
    this.onSelectedFolderChanged();
  }
  onClickOpenFolder(folder: FirebaseFolder) {
    this.mSelectedFolder = folder;
    this.onSelectedFolderChanged();
  }
  onClickNewFolder() {
    let prompt = this.mAlertController.create({
      title: 'Tạo FirebaseFolder',
      inputs: [
        {
          name: 'folder',
          placeholder: 'folder'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
          }
        },
        {
          text: 'Create',
          handler: data => {
            if (data) {
              this._CreateNewFolder(data);
            }
          }
        }
      ]
    });
    prompt.present();
  }
  onClickRenameFolder(folder: FirebaseFolder) {
    let prompt = this.mAlertController.create({
      title: 'Rename FirebaseFolder',
      inputs: [
        {
          name: 'folder',
          placeholder: 'folder'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {

          }
        },
        {
          text: 'Edit',
          handler: data => {

            if (data) {
              if (data.folder) {
                data.folder = data.folder.trim();
                this._RenameFolder(folder, data);
              }
            }
          }
        }
      ]
    });
    prompt.present();
  }
  onClickDeleteFolder(folder: FirebaseFolder) {
    this._DeleteFolder(folder);
  }
  onRightClickFolder(folder: FirebaseFolder, event) {
    if (event.which == 3) {
      event.preventDefault();
      this._ShowFolderContextMenu(folder);
    }
  }

  // =================== Temp Functions =============
  // =================== FirebaseFolder =====================
  _ShowFolderContextMenu(folder: FirebaseFolder) {
    let actionSheet = this.mActionSheetController.create({
      title: 'Chọn thao tác',
      buttons: [
        {
          text: 'Open',
          handler: () => {
            this.onClickOpenFolder(folder);
          }
        }, {
          text: 'Rename',
          handler: () => {
            this.onClickRenameFolder(folder);
          }
        }, {
          text: 'Delete',
          handler: () => {
            this.onClickDeleteFolder(folder);
          }
        }
      ]
    });
    actionSheet.present();
  }
  _DeleteFolder(folder: FirebaseFolder) {
    if (folder && folder.id && folder.id.length > 0) {
      let folderRef = this.mDirectoryCollectionRef.doc(folder.id);
      if (folderRef) {
        folderRef.delete();
      }

      let filesToDelete = this.mFilesData.filter(item => {
        return (item.folder === folder.path);
      });
      filesToDelete.forEach(file => {
        firebase.storage().ref(file.path).delete();
        this.mFileCollectionRef.doc(file.id).delete();
      });
    }
  }
  _CreateNewFolder(data) {

    if (data && data.folder && data.folder.length > 0) {
      if (this._InvalidateFolderName(data.folder)) {
        this._ShowToast("FirebaseFolder name is invalid", 2000);
        return;
      }

      let folderName = data.folder;
      let folderPath = this.mSelectedFolder.path + "/" + folderName;

      let exist: boolean = false;
      this.mData.forEach(item => {
        if (item.path === folderPath) {
          exist = true;
        }
      });

      if (exist) {
        this._ShowToast("This folder has already exist", 2000);
      } else {
        this.mDirectoryCollectionRef.add({
          name: folderName,
          path: folderPath
        });
      }
    }
  }
  _RenameFolder(folder: FirebaseFolder, data) {
    if (data && data.folder.length > 0) {
      if (this._InvalidateFolderName(data.folder)) {
        this._ShowToast("FirebaseFolder name is invalid", 2000);
        return;
      }
      if (folder.id && folder.id.length > 0) {
        let oldPath = folder.path + "";



        let filesToRename = this.mFilesData.filter(item => {
          return (item.folder === folder.path);
        });

        folder.path = folder.path.substring(0, folder.path.lastIndexOf('/')) + "/" + data.folder;
        folder.name = data.folder;

        /**Update folder path */
        let folderRef = this.mDirectoryCollectionRef.doc(folder.id);
        if (folderRef) {
          folderRef.set(folder);
        }

        /**Rename attribute folder of all file */
        filesToRename.forEach(file => {
          this.mFileCollectionRef.doc(file.id).update({
            folder: folder.path
          })
        });
        /**Firebase không cho phép rename path */
      }
    }
  }
  // =================== Files =====================
  _ShowFileContextMenu(file: FirebaseFile) {
    this.mSelectedFile = file;
    let actionSheet = this.mActionSheetController.create({
      title: 'Chọn thao tác',
      buttons: [
        {
          text: 'Open',
          handler: () => {
            this.onClickOpenFile(file);
          }
        }, {
          text: 'Rename',
          handler: () => {
            this.onClickRenameFile(file);
          }
        }, {
          text: 'Delete',
          handler: () => {
            this.onClickDeleteFile(file);
          }
        }
      ]
    });
    actionSheet.present();
  }
  _DeleteFile(file: FirebaseFile) {
    if (file && file.id && file.id.length > 0) {
      let fileRef = this.mFileCollectionRef.doc(file.id);
      if (fileRef) {
        fileRef.delete();
      }
      let storageRef = firebase.storage().ref(file.path);
      storageRef.delete();
    }
  }
  _RenameFile(file: FirebaseFile) {
    /**Firebase khong cho phep rename file */
  }
  _OpenFile(file: FirebaseFile) {

  }

}
