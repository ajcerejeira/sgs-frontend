for i in $(seq -180 180);
do
    sips -r $i redcar.png --out redcar$i.png
done