import { Plugin } from 'ckeditor5';
import ImageCopyrightEditing from "./imagecopyright/imagecopyrightediting";
import ImageCopyrightUi from "./imagecopyright/imagecopyrightui";

export default class ImageCopyright extends Plugin {

    static get requires() {
        return [ ImageCopyrightEditing, ImageCopyrightUi ];
    }

    /**
     * @inheritDoc
     */
    static get pluginName() {
        return 'ImageCopyright';
    }
}
