import * as React from "react";
import { Link } from "@yext/pages/components";
import { stagingBaseurl } from "../../sites-global/global";

/***
 * for using the all pages bread crumbs
 * 
 */

type data = {
  name: string;
  parents: [];
  baseUrl: string;
  address?: {
    line1: string;
    line2: string;
    city: string;
    region: string;
    postalCode: string;
  };
};

interface Parent {
  name: string;
  slug: string;
  dm_directoryChildrenCount: number;
  meta: {
    entityType: {
      id: string;
    }
  }
}
const BreadCrumbs = (props: data) => {
  const [list, setList] = React.useState<JSX.Element[]|null>(null);
  let breadcrumbs;
  const data: Array<{name:string, slug:string, count:number}> = [];
  React.useEffect(() => {
    setURL(props.parents, props.baseUrl);
  }, [setList]);

  const lastBreadcrumbName =
    props.address === undefined ? props.name : props.address.line1;
  const setURL = (parents:  Parent[] | null, baseUrl: string) => {
    if (parents) {
      for (let i = 0; i < parents.length; i++) {
        if (parents[i].meta.entityType.id == "ce_region") {
          data.push({
            name: parents[i].name,
            slug: `${parents[i].slug}`,
            count: parents[i].dm_directoryChildrenCount,
          });
          const reParentsName = parents[i].name;
          parents[i].name = reParentsName;          
        } else if (parents[i].meta.entityType.id == "ce_city") {

          const reParentsName = parents[i].name;
          parents[i].name = reParentsName;

          parents[i].slug = `${parents[i - 1].slug}/${parents[i].slug}`;
          data.push({
            name: parents[i].name,
            slug: parents[i].slug,
            count: parents[i].dm_directoryChildrenCount,
          });
        }
      }

      breadcrumbs = data.map((crumb: {name:string, slug:string, count:number}) => (
        <li key={crumb.slug}>
          {crumb.count == 1 ? (
            <Link
              href="javascript:void(0)"
              className="cursor-not-allowed"
              data-ya-track="Breadcrumbs"
              eventName={`Breadcrumbs`}
              rel="noopener noreferrer"
            >
              {" "}
              {crumb.name}
            </Link>
          ) : (
            <Link
              href={baseUrl + crumb.slug}
              data-ya-track="Breadcrumbs"
              eventName={`Breadcrumbs`}
              rel="noopener noreferrer"
            >
              {crumb.name}
            </Link>
          )}
        </li>
      ));
      setList(breadcrumbs);
    } else {
      setList(null);
    }
  };
  return (
    <div className="breadcrumb">
      <div className="mx-auto">
        <ul className="flex">
          <li>
            <Link
              className="home"
              href={stagingBaseurl ? stagingBaseurl : "/"}
              data-ya-track="Breadcrumbs"
              eventName={`Breadcrumbs`}
              rel="noopener noreferrer"
            >
              Locations
            </Link>
          </li>
          {list ? (
            list
          ) : (
            <>
              {props.address && props.address.city ? (
                <li className="inline-block">
                  {" "}
                  <Link
                    href={props.baseUrl + props.address.city}
                    data-ya-track="Breadcrumbs"
                    eventName={`Breadcrumbs`}
                    rel="noopener noreferrer"
                  >
                    {props.address.city ? props.address.city : ""}
                  </Link>
                </li>
              ) : (
                <></>
              )}
            </>
          )}
          {props.name === "United States" ? null : (
            <li>{props && lastBreadcrumbName}</li>
          )}
        </ul>
      </div>
    </div>
  );
};
export default BreadCrumbs;
