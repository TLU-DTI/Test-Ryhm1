using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;

public class RiskCard : MonoBehaviour, IPointerClickHandler, IDropHandler, IPointerEnterHandler, IPointerExitHandler
{
    public int scope;
    public int quality;
    public int time;
    public int money;
    public bool mitigated = false;
    public bool selected = false;
    private GameManager gameManager;
    private Image image;

    private Vector3 originalSize;
    private Vector3 selectedSize;
    public GameObject zoomPanel;
    public UnityEngine.UI.Image zoomImage;
    private Button zoomCloseButton;

    private void Start()
    {
        gameManager = FindObjectOfType<GameManager>();
        image = GetComponent<Image>();
        originalSize = transform.localScale;
        selectedSize = originalSize * 1.1f;

        GameObject zoomCanvas = GameObject.Find("ZoomCanvas");
        if (zoomCanvas != null)
        {
            zoomPanel = zoomCanvas.transform.Find("ZoomPanel").gameObject;
            if (zoomPanel != null)
            {
                zoomImage = zoomPanel.transform.Find("ZoomImage").GetComponent<UnityEngine.UI.Image>();
                if (zoomImage != null)
                {
                    UnityEngine.UI.Image cardImage = GetComponent<UnityEngine.UI.Image>();
                    if (cardImage != null && cardImage.sprite != null)
                    {
                        zoomImage.sprite = cardImage.sprite;
                    }
                    zoomCloseButton = zoomPanel.GetComponentInChildren<Button>();
                    if (zoomCloseButton != null)
                    {
                        zoomCloseButton.onClick.AddListener(CloseZoomView);
                    }
                }
            }
        }
        else
        {
            Debug.LogError("ZoomCanvas not found in the scene.");
        }
    }

    public void Select()
    {
        if (mitigated)
        {
            selected = false;
        }
        else
        {
            selected = !selected;
        }
        UpdateSize();
    }

    public void UpdateSize()
    {
        if (selected)
        {
            transform.localScale = selectedSize;
        }
        else
        {
            transform.localScale = originalSize;
        }
    }

    public void Deletion()
    {
        Destroy(gameObject);
    }

    public void OnPointerClick(PointerEventData eventData)
    {
        if (gameManager != null && mitigated == false && eventData.button == PointerEventData.InputButton.Left)
        {
            gameManager.SetSelectedRiskCard(this);
        } else if (gameManager != null && eventData.button == PointerEventData.InputButton.Right)
        {
            ShowZoomView();
        }
    }

    public void Mitigated()
    {
        mitigated = true;
        selected = false;
        SetTransparency(0.5f); // Set transparency to 50%
        UpdateSize(); // Ensure size is updated when mitigated
    }

    private void SetTransparency(float alpha)
    {
        if (image != null)
        {
            Color color = image.color;
            color.a = alpha;
            image.color = color;
        }
    }

    public void OnDrop(PointerEventData eventData)
    {
        MitigationCard mitigationCard = eventData.pointerDrag.GetComponent<MitigationCard>();
        if (mitigationCard != null && mitigated == false)
        {
            mitigationCard.ApplyMitigation(this);
            mitigationCard.Deletion();
        } else if (mitigationCard != null && mitigated == true)
        {
            Debug.Log("The risk card is already mitigated.");
        }
    }

    public void OnPointerEnter(PointerEventData eventData)
    {
        if (eventData.pointerDrag != null && eventData.pointerDrag.GetComponent<MitigationCard>() != null)
        {
            gameManager.SetSelectedRiskCard(this);
        }
    }

    public void OnPointerExit(PointerEventData eventData)
    {
        if (eventData.pointerDrag != null && eventData.pointerDrag.GetComponent<MitigationCard>() != null)
        {
            if (gameManager.selectedRiskCard == this)
            {
                selected = false;
                UpdateSize();
                gameManager.selectedRiskCard = null;
            }
        }
    }

    private void ShowZoomView()
    {
        zoomImage.sprite = GetComponent<UnityEngine.UI.Image>().sprite;
        zoomPanel.SetActive(true);
    }

    public void CloseZoomView()
    {
        zoomPanel.SetActive(false);
    }
}
