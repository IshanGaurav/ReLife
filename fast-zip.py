import os
import zipfile

def zipdir(path, ziph):
    for root, dirs, files in os.walk(path):
        if 'node_modules' in dirs:
            dirs.remove('node_modules')
        for file in files:
            file_path = os.path.join(root, file)
            arcname = os.path.relpath(file_path, os.path.dirname(path))
            ziph.write(file_path, arcname)

if __name__ == '__main__':
    zipf = zipfile.ZipFile('backend-deployment.zip', 'w', zipfile.ZIP_DEFLATED)
    zipdir('backend', zipf)
    zipf.close()
    print('Zipped successfully using python!')
