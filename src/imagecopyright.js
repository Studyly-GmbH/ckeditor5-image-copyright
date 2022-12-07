import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
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
