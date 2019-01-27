for i in $(seq -370 -361);
do
    sips -r $i body.png --out body$i.png
done