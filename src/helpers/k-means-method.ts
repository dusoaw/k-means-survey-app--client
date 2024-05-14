import { SurveyAnswer } from "../pages/ResultsPage/ResultsPage";

export class Point {
    x: number;
    y: number;
    email!: string;
    claster!: number;
    color!: string;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    setX = (x: number) => {
      this.x = x;
    }

    setY = (y: number) => {
        this.y = y;
    }

    setEmail = (email: string) => {
      this.email = email
    }

    setClaster = (claster: number) => {
      this.claster = claster;
    }

    setColor = (color: string) => {
      this.color = color;
    }
}

const generateCentroids = (points: Point[], k: number) => {
    const newCentroids = [];

    const minX = points.reduce((min, p) => Math.min(min, p.x), Infinity);
    const maxX = points.reduce((max, p) => Math.max(max, p.x), -Infinity);

    const minY = points.reduce((min, p) => Math.min(min, p.y), Infinity);
    const maxY = points.reduce((max, p) => Math.max(max, p.y), -Infinity);

    const colors = ["#7469B6", "#0A6847", "#FF0080"];

    for (let i = 0; i < k; i++) {
        const randomX = Math.random() * (maxX - minX) + minX;
        const randomY = Math.random() * (maxY - minY) + minY;
    
        let centroid = new Point(randomX, randomY);
        centroid.claster = i;
        centroid.setColor(colors[i]);
        
        newCentroids.push(centroid);
    }
    
    // console.log("chcek")
    // for(let i = 0; i< newCentroids.length; i++){
    //     console.log(newCentroids[i])
    //   }
    // console.log(JSON.parse(JSON.stringify(newCentroids)))

    // console.log(newCentroids)
    return newCentroids;
}

const findDistsances = (points: Point[], centroids: Point[]) => {
    let assigments: number[] = [];

    points.forEach(point => {
        let shotestDistance = Infinity;
        let shortestIndex = 0;
        let newColor = "";

        centroids.forEach(centroid => {
            const distance = Math.hypot(point.x - centroid.x, point.y - centroid.y);

            if (distance < shotestDistance) {
                shotestDistance = distance;
                shortestIndex = centroids.indexOf(centroid);
                newColor = centroid.color;
            }
        });

        point.setColor(newColor);
        point.setClaster(shortestIndex);
        assigments.push(shortestIndex);
    });

    return assigments;
}

const updateCentroids = (centroids: Point[], points: Point[]) => {
    centroids.forEach(centroid => {
        let newX = 0;
        let newY = 0;

        points.forEach(point => {
            if(point.claster === centroids.indexOf(centroid)) {
                newX += point.x;
                newY += point.y;
            }
        });

        const numberOfPoints = points.filter(point =>
            point.claster === centroids.indexOf(centroid)).length;

        centroid.setX(newX / numberOfPoints);
        centroid.setY(newY / numberOfPoints);
    });

    return centroids;
}

export const getClusteredData = (answers: SurveyAnswer[]) => {
    const k = 3;

    let points = answers.map(answer => {
        const point = new Point(answer.firstMetricAnswer, answer.secondMetricAnswer);
        point.setEmail(answer.email);

        return point;
    });

    let centroids = generateCentroids(points, k);

    let oldAssigmentList: number[] = [];
    let newAssigmentList = findDistsances(points, centroids);
    let oldPoints = points;

    while(!(newAssigmentList.length === oldAssigmentList.length
        && newAssigmentList.every((value, index) => value === oldAssigmentList[index]))) {
        centroids = updateCentroids(centroids, points);
        console.log(centroids);
        oldAssigmentList = newAssigmentList;
        newAssigmentList = findDistsances(points, centroids);
        // if(!oldPoints.every((point, index) => point.claster === points[index].claster)) {
        //     console.log(points)
        // }
        // else {
        //     console.log("same")
        // }
        // oldPoints = points;
    }

    return points;
}